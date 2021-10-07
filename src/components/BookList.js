import { useState, useEffect } from 'react';
import { db } from './../index';
import { collection, onSnapshot } from '@firebase/firestore';
import BookCard from './BookCard';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const BookList = () => {
    const [bookCollection, setBookCollection] = useState([]);
    
    useEffect(() => {
        onSnapshot(collection(db, 'books'), snapshot => {
            setBookCollection(snapshot.docs.map(doc => {
                return {...doc.data(), id: doc.id}
            }))
        }, (err) => {
            console.log(err, err.message);
        });
    }, [])

    return (
        <Box sx={{flexGrow: 1, maxWidth: '1000px', margin: '0 auto'}}>
            <Grid container spacing={{xs:1, sm:2, md:3} }>
            {bookCollection && 
                bookCollection.map(book => {
                    return (
                        <Grid key={book.id} item xs={12} sm={6} md={4}>
                            <BookCard {...book} />
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    );
}

export default BookList;