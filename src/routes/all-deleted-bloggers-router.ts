import {Router} from "express";
import {ioc} from "../IoCContainer";



export const allDeletedBloggersRouts = Router({})

allDeletedBloggersRouts.get('/',
  ioc.allDelBloggersController.getAllDeletedBloggers.bind(ioc.allDelBloggersController))