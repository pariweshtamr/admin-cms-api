import { verifyAccessJWT } from '../helpers/jwt.helper.js'
import { getSession } from '../models/session/Session.model.js'
import { getUserById } from '../models/user-model/User.model.js'

export const isAdminUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers
    console.log(authorization, 'auth')
    if (authorization) {
      //validate the accessJWT
      const decoded = verifyAccessJWT(authorization)

      if (decoded === 'jwt expired') {
        return res.status(403).json({
          status: 'error',
          message: 'jwt expired',
        })
      }
      const session = decoded?.email
        ? await getSession({ token: authorization })
        : null

      if (session?._id) {
        const user = await getUserById(session.userId)
        if (user?.role === 'admin') {
          req.user = user
          // req.user.password = undefined;
          // req.user.refreshJWT = undefined;

          next()
          return
        }
      }
    }
    return res.status(401).json({
      status: 'error',
      message: 'Unauthenticated. Please log in again.',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Server error.',
    })
  }
}
