import {
  BlogsType
} from "../types/tsTypes";
import {MyModelBlogs} from "../mongoose/BlogsSchemaModel";
import {injectable} from "inversify";


@injectable()
export class BlogsRepository {
  async findBlogs(pageSize: number, startIndex: number, field: string, direction: number): Promise<BlogsType[]> {
    return await MyModelBlogs.find(
      {},
      {
        _id: false,
        __v: false
      })
      .limit(pageSize)
      .skip(startIndex)
      .sort({[field]: direction}).lean()
  }

  async countDocuments([...filters]) {
    return await MyModelBlogs.countDocuments({$and: filters})
  }

  async createBlog(newBlog: BlogsType): Promise<Boolean> {
    const result = await MyModelBlogs.create(newBlog)
    return result.id
  }

  async findBlogById(id: string): Promise<BlogsType | null> {
    const foundBlog = await MyModelBlogs.findOne({id: id}, {
      _id: false,
      __v: false,
    }).lean()

    if (!foundBlog) {
      return null
    }
    return foundBlog
  }

  async updatedBlogById(id: string, newBlog: BlogsType): Promise<Boolean> {
    return await MyModelBlogs.findOneAndUpdate(
      {id: id},
      {
        $set: {
          id: newBlog.id,
          name: newBlog.name,
          websiteUrl: newBlog.websiteUrl,
          createdAt: newBlog.createdAt
        }
      },
      {returnDocument: "after", projection: {_id: false, __v: false}}).lean()
  }

  async deletedBlogById(id: string): Promise<Boolean> {
    const result = await MyModelBlogs.deleteOne({id: id})
    return result.deletedCount === 1
  }
}






















