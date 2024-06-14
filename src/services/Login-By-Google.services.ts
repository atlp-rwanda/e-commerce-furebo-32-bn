import { Profile } from "passport";

import dotenv from 'dotenv'

import passport from "passport";

const GoogleStrategy = require('passport-google-oauth2').Strategy;

dotenv.config();

import User from "../database/models/user.model";
import { UserSignupAttributes } from "../types/user.types";
const googleStrategyOptions= {
    clientID:process.env.GOOGLE_ID,
    clientSecret:process.env.GOOGLE_SECRET,
    callbackURL:process.env.CALLBACK_URL
  }

export const  googleAuthCallBack=async function(
    _accessToken:string,
    _refreshToken:string,
    profile:Profile,
    done:any
)
{
    try{
        const email=profile.emails?.[0].value

        const[user,_created]= await User.findOrCreate({
            where:{email:email},
            defaults:{
                firstName:profile.name?.givenName,
                lastName:profile.name?.familyName,
                password:process.env.GOOGLE_PASSWORD,
                verified:process.env.GOOGLE_VERIFY,
                role:process.env.GOOGLE_ROLE
            } as UserSignupAttributes
        })

        return done(null,user)

    }
    catch(error){
        throw new Error("Error occured please try again")
    }
}

passport.use(new GoogleStrategy(googleStrategyOptions,googleAuthCallBack))

  export function serialize(){
   return passport.serializeUser((user:UserSignupAttributes, done) => {
      const authenticatedUser= user as User
      done(null, authenticatedUser.id)
    })
  }
  
  export function deserialize(){
    return  passport.deserializeUser(
      async (id: string, done) => {
        try {
          const user = await User.findByPk(id);
          done(null, user);
        } catch (error) {
          done(error);
        }
      },
    )
  }

serialize();
deserialize();
