import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../controllers/UserContext';
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { db, storage } from '../index';
import Spinner from './Spinner';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Fab from '@mui/material/Fab';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Account = () => {
    const history = useHistory();
    const { uid, email } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [file, setFile] = useState(null);

    const handleBack = () => {
        history.go(-1);
    }

    const handleFileChange = e => {
        setFile(e.target.files[0]);
    }

    const handleFileUpload = () => {
        const storageRef = ref(storage, `avatars/${uid}/${file.name}`);
        uploadBytes(storageRef, file)
            .then((snapshot) => {
                console.log(snapshot)
            })
        const userDocRef = doc(db, 'users', uid);
        updateDoc(userDocRef, {
            'avatar': file.name
        })
    }

    useEffect(() => {
        const q = query(collection(db, 'users'), where('id', '==', uid));
        getDocs(q)
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const { username, avatar } = doc.data();
                    setUsername(username);
                    if (avatar === 'default-avatar.png') {
                        getDownloadURL(ref(storage, `avatars/${avatar}`))
                            .then(url => {
                                setImgUrl(url);
                            })
                    } else {
                        getDownloadURL(ref(storage, `avatars/${uid}/${avatar}`))
                            .then(url => {
                                setImgUrl(url);
                            })
                    }
                })
            })
    }, [uid]);

    return (
            <Box 
                sx={{
                    maxWidth: '1000px',
                    m: "0 auto",
                    p: '2rem',
                    display: 'flex',
                    justifyContent: 'space-around',
                    borderRadius: '15px',
                    boxShadow: '0 0 10px rgba(0,0,0, .1)'
                }}
            >
                {
                    imgUrl !== '' 
                    ?   <Box sx={{
                            display: 'flex',
                            width: '300px',
                            height: '300px',
                            backgroundColor: '#fff'
                            }}
                    >   
                            <CardMedia
                            component="img"
                            height="100%"
                            width="100%"
                            image={imgUrl}
                            alt="user avatar"
                            sx={{alignSelf: 'center', borderRadius: '50%'}}
                            />
                        </Box>
                    :   <Box sx={{
                            height: 300,
                            width: 300,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            borderRadius: '50%'
                            }}
                    >
                            <Spinner />
                    </Box>  
                }
                <Box 
                    sx={{
                        padding: '0 2rem 0 2.5rem',
                        width: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start' 
                    }}
                >
                        <Fab
                            onClick={handleBack}
                            variant="extended"
                            color="primary"
                            aria-label="go back"
                            sx={{
                                alignSelf: 'flex-end',
                                mb:3,
                                fontSize: '.8rem',
                                lineHeight: 2
                            }} 
                        >
                            <ArrowBackOutlinedIcon sx={{mr:1, fontSize: '1.3rem'}} />
                            back
                        </Fab>
                    <Typography
                        variant="h4"
                        component="div"
                        gutterBottom
                    >
                        Account Details
                    </Typography>
                    <Typography
                        variant="h5"
                        component="div"
                        gutterBottom
                        sx={{fontWeight: 300}}
                    >
                        Username: { username }
                    </Typography>
                    <Typography
                        variant="h5"
                        component="div"
                        gutterBottom
                        sx={{fontWeight: 300}}
                    >
                        Email: { email }
                    </Typography>
                    <Typography
                        variant="h5"
                        component="div"
                        gutterBottom
                        sx={{fontWeight: 300}}
                    >
                        Change avatar: 
                            <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="change-avatar"
                            multiple
                            type="file"
                            onChange={handleFileChange}
                            />
                            <label htmlFor="change-avatar">
                            <Button 
                                variant="outlined" 
                                component="span" 
                                style={{marginLeft: '10px'}} 
                                onClick={handleFileUpload}
                            >
                                Upload
                            </Button>
                            </label> 
                    </Typography>
                </Box>
            </Box>
    );
}
 
export default Account;