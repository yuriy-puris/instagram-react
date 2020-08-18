import React from "react";
import { useProfilePageStyles } from "../styles";
import Layout from '../components/shared/Layout';
import { defaultCurrentUser } from '../data';
import { Hidden, Card, CardContent } from '@material-ui/core';
import ProfilePicture from '../components/shared/ProfilePicture';

const ProfilePage = () => {
  const classes = useProfilePageStyles();
  const isOwner = true;
  const [showOptionsMenu, setOptionsMenu] = React.useState(false);

  const handleOptionsMenuClick = () => {
    setOptionsMenu(true);
  };

  return (
    <Layout title={`${defaultCurrentUser.name} (@${defaultCurrentUser.username})`}>
      <div className={classes.container}>
        <Hidden xsDown>
          <Card className={classes.cardLarge}>
            <ProfilePicture isOwner={isOwner} />
            <CardContent className={classes.cardContentLarge}>
              <ProfileNameSection 
                user={defaultCurrentUser}
                isOwner={isOwner}
                handleOptionsMenuClick={handleOptionsMenuClick}
              />
              <PostCountSection />
              <NameBioSection />
            </CardContent>
          </Card>
        </Hidden>
        <Hidden smUp>
          <Card className={classes.cardSmall}>
            <CardContent>
              <section className={classes.sectionSmall}>
                <ProfilePicture size={77} isOwner={isOwner} />
                <ProfileNameSection 
                  user={defaultCurrentUser}
                  isOwner={isOwner}
                  handleOptionsMenuClick={handleOptionsMenuClick}
                />
              </section>
              <NameBioSection />
            </CardContent>
            <PostCountSection />
          </Card> 
        </Hidden>
      </div>
    </Layout>
  )
};

const ProfileNameSection = ({ user, isOwner, handleOptionsMenuClick }) => {
  const classes = useProfilePageStyles();

  return <div>ProfileNameSection</div>;
};

const PostCountSection = () => {
  return <div>PostCountSection</div>;
};

const NameBioSection = () => {
  return <div>NameBioSection</div>;
};

export default ProfilePage;
