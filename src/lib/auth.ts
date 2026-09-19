import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your.email@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password.');
        }

        const email = credentials.email.toLowerCase().trim();
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            skills: true,
            badges: true
          }
        });

        if (!user || !user.password) {
          throw new Error('Invalid email or password.');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid email or password.');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar,
          title: user.title,
          tier: user.tier,
          points: user.points,
          rating: user.rating,
        } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.title = (user as any).title;
        token.image = (user as any).image;
        token.tier = (user as any).tier;
        token.points = (user as any).points;
        token.rating = (user as any).rating;
      }

      if (trigger === 'update' && session) {
        if (session.name) token.name = session.name;
        if (session.title) token.title = session.title;
        if (session.points) token.points = session.points;
        if (session.tier) token.tier = session.tier;
        if (session.rating) token.rating = session.rating;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).title = token.title;
        (session.user as any).image = token.image;
        (session.user as any).tier = token.tier;
        (session.user as any).points = token.points;
        (session.user as any).rating = token.rating;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET || 'skillswap-super-secret-key-32-chars-long-production-grade',
};
