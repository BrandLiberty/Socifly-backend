import EditUserPProfile from "../../models/Personal-profile.js";

export const editProfile = (req, res) => {
  console.log("from edit route");
  const { name, about, phone, address, url, organization_name } = req.body;

  EditUserPProfile.create({
    name,
    about,
    phone,
    address,
    organization_name,
    url,
    organization_logo: req.files[0].originalname,
    photo: req.files[1].originalname,
  })
    .then((result) => res.status(200).json(result))
    
    
    .catch((err => {
      res.send(err)
    }))
};
