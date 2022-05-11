import {deletedAllPostsByBloggerId} from "./posts-repository";

type errorType = {
  message: string
  field: string
}
type arrayErrorsType = Array<errorType>
type bloggerType = {
  id: number
  name: string
  youtubeUrl: string
}
export type arrayBloggersType = Array<bloggerType>
type ReturnTypeObject = {
  data: bloggerType,
  errorsMessages: Array<errorType>,
  resultCode: number
}

export let bloggers: arrayBloggersType = [
  {id: 1, name: 'Dimych', youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA'},
  {id: 2, name: 'Лекс', youtubeUrl: 'https://www.youtube.com/c/ITBEARD'},
  {id: 3, name: 'Lex Fridman', youtubeUrl: 'https://www.youtube.com/c/lexfridman'},
  {id: 4, name: 'Тимофей Хирьянов', youtubeUrl: 'https://www.youtube.com/c/ТимофейХирьянов'},
  {id: 5, name: 'SpaceX', youtubeUrl: 'https://www.youtube.com/c/SpaceX'},
]
export let deletedBloggers: arrayBloggersType = []

const incorrectValues = {
  message: "inputName has incorrect values",
  field: "name"
}
const anEmptyObject = {
  message: "An empty object was received",
  field: "empty object"
}
const incorrectFieldYoutubeUrl = {
  "message": "The field YoutubeUrl must match the regular expression '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'.",
  "field": "youtubeUrl"
}
const notFoundBloggerId = {
  message: "Not found '/:bloggerId'",
  field: "bloggerId"
}
const youtubeUrlRegExp = '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'


export const bloggersRepository = {
  async findBloggers(youtubeUrl: string | null | undefined): Promise<arrayBloggersType> {
    if (youtubeUrl) {
      return bloggers.filter(p => p.youtubeUrl.toLowerCase().split("/")[bloggers[0].youtubeUrl.toLowerCase().split("/").length - 1].indexOf(youtubeUrl.toLowerCase()) > -1)
    } else {
      return bloggers
    }
  },

  async createNewBlogger(name: string, youtubeUrl: string): Promise<ReturnTypeObject> {
    let resultCode = 0;
    const errorsArray: arrayErrorsType = [];

    if (!name || !youtubeUrl) {
      return {
        data: {
          id: 0,
          name: name,
          youtubeUrl: youtubeUrl
        },
        errorsMessages: [anEmptyObject],
        resultCode: 1
      }
    }

    // create new unique id
    let newId = +(new Date());
    let count = 0;
    while (count < 10 && bloggers.find(i => i.id === newId)) {
      newId = +(new Date());
      count++
    }
    if (name.length <= 0 || name.length > 15) {
      errorsArray.push(incorrectValues)
      resultCode = 1;
    }
    if (youtubeUrl.match(youtubeUrlRegExp) === null || youtubeUrl.length > 100) {
      errorsArray.push(incorrectFieldYoutubeUrl)
      resultCode = 1;
    }

    const newBlogger = {
      id: 0,
      name: name,
      youtubeUrl: youtubeUrl
    }
    if (errorsArray.length === 0) {
      newBlogger.id = newId
      bloggers.push(newBlogger)
    }

    return {
      data: newBlogger,
      errorsMessages: errorsArray,
      resultCode: resultCode
    }
  },

  async getBloggerById(id: number): Promise<Boolean | bloggerType> {
    const blogger = bloggers.find(v => v.id === id)
    if (blogger) {
      return blogger
    } else {
      return false
    }
  },

  async updateBloggerById(id: number, name: string, youtubeUrl: string): Promise<ReturnTypeObject> {
    let resultCode = 0;
    let errorsArray: Array<errorType> = [];

    const blogger = await bloggers.find(v => v.id === +id)
    if (!blogger) {
      errorsArray.push(notFoundBloggerId)
      return {
        data: {
          id: 0,
          name: name,
          youtubeUrl: youtubeUrl
        },
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }

    if (name.length <= 0 || name.length > 15) {
      errorsArray.push(incorrectValues)
      resultCode = 1
    }
    if (youtubeUrl.match(youtubeUrlRegExp) === null || youtubeUrl.length > 100) {
      errorsArray.push(incorrectFieldYoutubeUrl)
      resultCode = 1
    }
    if (blogger) {
      blogger.name = name
      blogger.youtubeUrl = youtubeUrl
    }
    return {
      data: blogger,
      errorsMessages: errorsArray,
      resultCode: resultCode
    }
  },

  async deletedBloggerById(id: number): Promise<boolean> {
    if (!id) {
      return false
    }
    // delete from bloggers array
    const blogger = bloggers.filter(v => v.id === id)

    if (bloggers.filter(v => v.id === id) && bloggers.indexOf(blogger[0]) !== -1) {
      const newV = bloggers.indexOf(blogger[0]);
      bloggers.splice(newV, 1);
      try {

        // If the blogger is in the array, then we call the function in the post repository
        // deletedAllPostsByBloggerId so that it deletes all posts with this bloggerId
        await deletedAllPostsByBloggerId(id);

        // Checking the blogger in the deleted array, if it is not there, then push him there
        if (deletedBloggers.filter(v => v.id === id).length === 0) {
          deletedBloggers.push(blogger[0])
        }
      } catch (e) {
        console.log("Error => function deletedAllPostsByBloggerId. " +
          "Фунция сделана самостоятельно, не по заданию возможна ошибка при тестах.")
      }
    }
    return true
  }
}