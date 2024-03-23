import multer from "multer"
//We can store the file both in disk and memory, so we are using a more customized way of storing on disk rater than using dest property in
//options object we are using storage property with diskstorage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  })
  
   const upload = multer({ storage: storage })

   export default upload