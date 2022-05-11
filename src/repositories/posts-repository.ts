import {bloggers} from "./bloggers-repository";

export let posts = [
  {
    id: 1,
    title: 'Dimych post',
    shortDescription: 'Why do we use it?',
    content: "It is a long established fact that a reader will be distracted by the readable " +
      "content of a page when looking at its layout. The point of using Lorem Ipsum is that",
    bloggerId: 1,
    bloggerName: "Dimych"
  },
  {
    id: 2,
    title: 'Лекс post',
    shortDescription: 'Where can I get some?',
    content: "There are many variations of passages of Lorem Ipsum available, but the" +
      " majority have suffered alteration in some form, by injected humour,",
    bloggerId: 2,
    bloggerName: "Лекс"
  },
  {
    id: 3,
    title: 'Lex Fridman post',
    shortDescription: 'Where does it come from?',
    content: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots " +
      "in a piece of classical Latin literature from 45 BC, making",
    bloggerId: 3,
    bloggerName: "Lex Fridman"
  },
  {
    id: 4,
    title: 'Тимофей Хирьянов post',
    shortDescription: 'What is Lorem Ipsum?',
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    bloggerId: 4,
    bloggerName: "Тимофей Хирьянов"
  },
  {
    id: 5,
    title: 'SpaceX post',
    shortDescription: 'RESERVE YOUR RIDE ONLINE',
    content: "Find all the information you need to make a reservation online, everything from " +
      "port size to technical specifications to licensing information. Once your reservation " +
      "request is approved, SpaceX will provide you with a welcome package outlining next" +
      " steps for launch.",
    bloggerId: 5,
    bloggerName: "SpaceX"
  }
]

type postsType = {
  id: number
  title: string
  shortDescription: string
  content: string
  bloggerId: number
  bloggerName: string
}
type arrayPostType = Array<postsType>
type errorType = {
  message: string
  field: string
}
type arrayErrorsType = Array<errorType>

type ReturnTypeObject = {
  data: postsType,
  errorsMessages: Array<errorType>,
  resultCode: number
}

type bloggerIdAndArrayPosts = [bloggerIdKey: number, posts: Array<postsType>]
type allDeletedPosts = Array<bloggerIdAndArrayPosts>
let arrayAllDeleted: allDeletedPosts = []

const incorrectValues = {
  message: "inputModel has incorrect values",
  field: "title, description or content"
}
const notFoundBloggerId = {
  message: "Invalid 'bloggerId': such blogger doesn't exist",
  field: "bloggerId"
}
const notFoundPostId = {
  message: "Invalid 'postId': such post doesn't exist",
  field: "postId"
}
const anEmptyObject = {
  message: "An empty object was received",
  field: "An empty object"
}


// The function is called when we delete a blogger by his id.
export async function deletedAllPostsByBloggerId(bloggerIdToDell: number) {
  // Deleting all posts and adding them to a hidden deleted folder "arrayAllDeleted".
  const currentForDeletedPosts = posts.filter(v => v.bloggerId === bloggerIdToDell)
  // If the blogger has no posts, the function returns null
  if (currentForDeletedPosts.length === 0) {
    return null
  }
  const lengthPost = currentForDeletedPosts.length
  if (arrayAllDeleted.length !== 0) {
    let foundBloggerId = false
    for (let p = 0; p < arrayAllDeleted.length; p++) {
      if (bloggerIdToDell === arrayAllDeleted[p][0]) {
        arrayAllDeleted[p][1] = [...arrayAllDeleted[p][1], ...currentForDeletedPosts]
        foundBloggerId = true
      }
    }
    if (!foundBloggerId) {
      arrayAllDeleted.push([currentForDeletedPosts[0].bloggerId, currentForDeletedPosts])
    }
  } else {
    arrayAllDeleted.push([currentForDeletedPosts[0].bloggerId, currentForDeletedPosts])
  }

  // We go through all the posts and if there is a bloggerID we delete this post
  for (let p = 0; p < lengthPost; p++) {
    const delPost = posts.filter(v => v.bloggerId === bloggerIdToDell)
    if (posts.find(v => v.bloggerId === bloggerIdToDell) && posts.indexOf(delPost[0]) !== -1) {
      const newV = posts.indexOf(delPost[0]);
      posts.splice(newV, 1);
    }
  }
}


export const postsRepository = {
  async findPosts(title: string | null | undefined): Promise<arrayPostType>{
    if (title) {
      return posts.filter(p => p.title.toLowerCase().split("/")[posts[0].title.toLowerCase().split("/").length - 1].indexOf(title.toLowerCase()) > -1)
    } else {
      return posts
    }
  },

  async createPost(title: string, shortDescription: string, content: string, bloggerId: number): Promise<ReturnTypeObject> {
    if (!title || !shortDescription || !content || !bloggerId) {
      return {
        data: {
          id: 0,
          title: title,
          shortDescription: shortDescription,
          content: content,
          bloggerId: bloggerId,
          bloggerName: ""
        },
        errorsMessages: [anEmptyObject],
        resultCode: 1
      }
    }
    let errorsArray: arrayErrorsType = [];
    let resultCode = 0;
    let newPost = {
      id: 0,
      title: title,
      shortDescription: shortDescription,
      content: content,
      bloggerId: bloggerId,
      bloggerName: ""
    }

    let foundBloggerId = bloggers.find(v => v.id === bloggerId)

    if (title.length > 30 || shortDescription.length > 100 || content.length > 1000) {
      errorsArray.push(incorrectValues)
      resultCode = 1;
    }
    if (!foundBloggerId) {
      errorsArray.push(notFoundBloggerId)
      resultCode = 1;
    }

    if (errorsArray.length === 0 && foundBloggerId) {
      // create new unique id
      let newId = +(new Date());
      let count = 0;
      while (count < 50 && posts.find(i => i.id === newId)) {
        newId = +(new Date());
        count++
      }
      newPost.id = newId;
      newPost.bloggerName = foundBloggerId.name
      posts.push(newPost)
    }

    return {
      data: newPost,
      errorsMessages: errorsArray,
      resultCode: resultCode
    }
  },

  async getPostById(id: number): Promise< Boolean | postsType >{
    const foundPost = posts.find(v => v.id === id)
    if (foundPost) {
      return foundPost
    }
    return false
  },

  async updatePostById(id: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<ReturnTypeObject> {
    let resultCode = 0;
    const searchPost = posts.find(v => v.id === id);
    const searchBloggerId = bloggers.find(b => b.id === bloggerId);
    const errorsArray: arrayErrorsType = [];

    if (title.length > 30 || shortDescription.length > 100 || content.length > 1000) {
      errorsArray.push(incorrectValues)
      resultCode = 1
    }
    if (!searchPost) {
      errorsArray.push(notFoundPostId)
      return {
        data: {
          id: 0,
          title: title,
          shortDescription: shortDescription,
          content: content,
          bloggerId: bloggerId,
          bloggerName: searchBloggerId?.name + ""
        },
        errorsMessages: errorsArray,
        resultCode: 1
      }
    }
    if (!searchBloggerId) {
      errorsArray.push(notFoundBloggerId)
      resultCode = 1
    }
    if (searchPost && searchBloggerId) {
      searchPost.title = title
      searchPost.shortDescription = shortDescription
      searchPost.content = content
      searchPost.bloggerId = bloggerId
      searchPost.bloggerName = searchBloggerId.name
    }
    return {
      data: searchPost,
      errorsMessages: errorsArray,
      resultCode: resultCode
    }
  },

  async deletedById(id: number): Promise<Boolean> {
    const post = posts.filter(v => v.id === id)

    if (posts.filter(v => v.id === id) && posts.indexOf(post[0]) !== -1) {
      const newV = posts.indexOf(post[0]);
      posts.splice(newV, 1);
    }
    return true
  }
}