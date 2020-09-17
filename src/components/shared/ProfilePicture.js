import React from "react";
import { useProfilePictureStyles } from "../../styles";
import { Person } from '@material-ui/icons';
import handleImageUpload from "../../utils/handleImageUpload";
import { useMutation } from "@apollo/react-hooks";
import { EDIT_USER_AVATAR } from '../../graphql/mutations';
import { UserContext } from '../../App';

const ProfilePicture = ({ isOwner, size, image }) => {
  const { currentUserId } = React.useContext(UserContext); 
  const classes = useProfilePictureStyles({ size, isOwner });
  const inputRef = React.useRef();
  const [editUserAvatar] = useMutation(EDIT_USER_AVATAR);
  const [img, setImg] = React.useState(image);

  const handleUpdateProfilePic = async event => {
    const url = await handleImageUpload(event.target.files[0]);
    const variables = { id: currentUserId, profileImage: url };
    await editUserAvatar({ variables });
    setImg(url);
  };

  const openFileInput = () => {
    inputRef.current.click();
  };

  return (
    <section className={classes.section}>
      <input 
        style={{ display: 'none' }}
        ref={inputRef}
        type='file'
        onChange={handleUpdateProfilePic}
      />
      {
        image ? (
          <div 
            className={classes.wrapper}
            onClick={isOwner ? openFileInput : () => null}>
            <img src={image} alt="user profile" className={classes.image} />
          </div>
        ) : (
          <div className={classes.wrapper}>
            <Person className={classes.person} />
          </div>
        ) 
      }
    </section>
  )
}

export default ProfilePicture;
