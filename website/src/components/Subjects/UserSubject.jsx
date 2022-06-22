import React, {useState} from 'react';
import {Box, Button, Card, CardActions, CardContent, CircularProgress, Typography} from "@mui/material";

const UserSubject = ({
  subject,
  deleteSubject,
}) => {

  const [loading, setLoading] = useState(false);

  const deleteUserSubject = () => {
    setLoading(true);
    fetch(`https://southamerica-east1-cloud-student-system.cloudfunctions.net/delete-user-subject?subjectId=${subject.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('cloud-token')}` }
    })
      .then(() => deleteSubject(subject))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }

  return (
    <Box sx={{minWidth: 300}} style={{marginRight: 20}}>
      <Card variant={'outlined'}>
        <CardContent>
          <Typography sx={{fontSize: 20, fontWeight: 'bold'}} gutterBottom>
            {subject.name}
          </Typography>
        </CardContent>
        <CardActions>
          {
            loading ?
            <Button size={'small'} disabled>
              <CircularProgress size={25} color={'primary'}/>
            </Button> :
            <Button size={'small'} onClick={deleteUserSubject}>Desanotarse</Button>
          }
        </CardActions>
      </Card>
    </Box>
  );
}

export default UserSubject;