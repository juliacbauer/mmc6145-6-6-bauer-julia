import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

// this handler runs for /api/book with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
  async function handler(req, res) {
    // User info can be accessed with req.session
    // No user info on the session means the user is not logged in
    if(!req.session.user) {
      return res.status(401).end()
    }
    switch(req.method) {
    // TODO: On a POST request, add a book using db.book.add with request body (must use JSON.parse)
      case 'POST':
        try {
          const book = JSON.parse(req.body)
          const addedBook = await db.book.add(req.session.user.id, book)
          //destroy session for null
          if(addedBook === null) {
            req.session.destroy() 
            return res.status(401)
          }
          return res.status(200).json({book: addedBook})
        //catch error and show message   
        } catch (error) {
          return res.status(400).json({error: error.message})
        }
    // TODO: On a DELETE request, remove a book using db.book.remove with request body (must use JSON.parse)
      case 'DELETE':
        try {
          const book = JSON.parse(req.body)
          const deletedBook = await db.book.remove(req.session.user.id, book.id)
          //destroy session for null
          if(deletedBook === null) {
            req.session.destroy()
            return res.status(401)
          }
          return res.status(200).json({book: deletedBook})
        //catch error and show message
        } catch (error) {
          return res.status(400).json({error: error.message})
        }
    // TODO: Respond with 404 for all other requests
      default:
        return res.status(404).end()
    }
  },
  sessionOptions
)