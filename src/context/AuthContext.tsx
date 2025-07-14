import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setFavorites([]);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // First, try to get the profile
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // If profile doesn't exist, create it
      if (error && error.code === 'PGRST116') {
        console.log('Profile not found, creating new profile...');
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            name: session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0] || 'New User',
            user_type: 'client'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          throw createError;
        }
        
        profile = newProfile;
      } else if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (profile) {
        const userProfile: User = {
          id: profile.id,
          name: profile.name,
          email: session?.user?.email || '',
          phone: profile.phone || undefined,
          type: profile.user_type,
          avatar: profile.avatar_url || undefined,
          whatsapp: profile.whatsapp || undefined,
          telegram: profile.telegram || undefined,
          address: profile.address || undefined,
          isApproved: profile.is_approved,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at
        };
        setUser(userProfile);
        
        // If this is a realtor and no properties exist, create sample data
        if (userProfile.type === 'realtor') {
          await createSampleDataIfNeeded(userProfile.id);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSampleDataIfNeeded = async (realtorId: string) => {
    try {
      // Check if this realtor already has properties
      const { data: existingProperties, error } = await supabase
        .from('properties')
        .select('id')
        .eq('realtor_id', realtorId)
        .limit(1);

      if (error) {
        console.error('Error checking existing properties:', error);
        return;
      }

      // If no properties exist, create sample data
      if (!existingProperties || existingProperties.length === 0) {
        console.log('Creating sample properties for realtor...');
        
        const { error: functionError } = await supabase
          .rpc('insert_sample_properties', { realtor_user_id: realtorId });

        if (functionError) {
          console.error('Error creating sample properties:', functionError);
        } else {
          console.log('Sample properties created successfully');
        }
      }
    } catch (error) {
      console.error('Error in createSampleDataIfNeeded:', error);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
        return;
      }

      setFavorites(data?.map(fav => fav.property_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, userType: 'client' | 'realtor'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            user_type: userType
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        return false;
      }

      // If user was created successfully
      if (data.user) {
        console.log('User registered successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setFavorites([]);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          phone: userData.phone,
          avatar_url: userData.avatar,
          whatsapp: userData.whatsapp,
          telegram: userData.telegram,
          address: userData.address
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }

      setUser(prev => prev ? { ...prev, ...userData } : null);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    if (!user) return;

    try {
      const isFavorite = favorites.includes(propertyId);

      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);

        if (error) {
          console.error('Error removing favorite:', error);
          return;
        }

        setFavorites(prev => prev.filter(id => id !== propertyId));
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            property_id: propertyId
          });

        if (error) {
          console.error('Error adding favorite:', error);
          return;
        }

        setFavorites(prev => [...prev, propertyId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    login,
    register,
    logout,
    updateUser,
    isLoading,
    favorites,
    toggleFavorite
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};