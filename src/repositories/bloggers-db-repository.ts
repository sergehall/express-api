import {bloggersCollection, postsCollection} from "./db";
import {
  ArrayErrorsType,
  BloggerType,
  ErrorType,
  ReturnTypeObjectBloggers,
  Pagination
} from "../types/all_types";
import {MongoHasNotUpdated, notFoundBloggerId} from "../middlewares/input-validator-middleware";




export class BloggersRepository {
  async findBloggers(pageNumber: number, pageSize: number, searchNameTerm: string| null): Promise<Pagination> {
    let filter = {}

    if (searchNameTerm !== null) {
      filter = {name: {$regex: searchNameTerm}}
    }
    const startIndex = (pageNumber - 1) * pageSize
    const result = await bloggersCollection.find(filter).limit(pageSize).skip(startIndex).toArray()
    // @ts-ignore
    result.forEach(i => delete i._id)

    const totalCount = await bloggersCollection.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: result
    };
  }

  async createNewBlogger(newBlogger: BloggerType): Promise<ReturnTypeObjectBloggers> {
    const errorsArray: ArrayErrorsType = [];

    const result = await bloggersCollection.insertOne(newBlogger)
    if (!result.insertedId) {
      errorsArray.push(MongoHasNotUpdated)
    }
    if (errorsArray.length !== 0) {
      return {
        data: newBlogger,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    return {
      data: newBlogger,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async getBloggerById(id: number): Promise<BloggerType | null> {
    const blogger: BloggerType | null = await bloggersCollection.findOne({id: id})
    if (blogger) {
      return blogger
    } else {
      return null
    }
  }

  async updateBloggerById(id: number, name: string, youtubeUrl: string): Promise<ReturnTypeObjectBloggers> {
    let errorsArray: Array<ErrorType> = [];
    const data = {
      id: id,
      name: name,
      youtubeUrl: youtubeUrl
    }

    const result = await bloggersCollection.updateOne({id: id}, {
      $set: {
        name: name,
        youtubeUrl: youtubeUrl
      }
    })

    if (result.matchedCount === 0) {
      errorsArray.push(notFoundBloggerId, MongoHasNotUpdated,)
    }

    if (errorsArray.length !== 0) {
      return {
        data: data,
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    return {
      data: data,
      errorsMessages: errorsArray,
      resultCode: 0
    }
  }

  async deletedBloggerById(id: number): Promise<boolean> {
    const result = await bloggersCollection.deleteOne({id: id})
    return result.deletedCount !== 0
    //   if (!id) {
    //     return false
    //   }
    //   // delete from bloggers array
    //   const blogger = bloggers.filter(v => v.id === id)
    //
    //   if (bloggers.filter(v => v.id === id) && bloggers.indexOf(blogger[0]) !== -1) {
    //     const newV = bloggers.indexOf(blogger[0]);
    //     bloggers.splice(newV, 1);
    //     try {
    //
    //       // If the blogger is in the array, then we call the function in the post repository
    //       // deletedAllPostsByBloggerId so that it deletes all posts with this bloggerId
    //       await deletedAllPostsByBloggerId(id);
    //
    //       // Checking the blogger in the deleted array, if it is not there, then push him there
    //       if (deletedBloggers.filter(v => v.id === id).length === 0) {
    //         deletedBloggers.push(blogger[0])
    //       }
    //     } catch (e) {
    //       console.log("Error => function deletedAllPostsByBloggerId. " +
    //         "Фунция сделана самостоятельно, не по заданию возможна ошибка при тестах.")
    //     }
    //   }
    //   return true
  }

  async deletedAllBloggers(): Promise<boolean> {
    const result = await bloggersCollection.deleteMany({})
    return result.acknowledged
  }
}