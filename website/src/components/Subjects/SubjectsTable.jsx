import React, {useState} from 'react';
import {
  Button, CircularProgress,
  Icon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from "@mui/material";
import {Add, Delete} from "@mui/icons-material";

const SubjectsTable = ({
  subjects,
  deleteSubject,
  addSubject,
}) => {

  const [loadingById, setLoadingById] = useState(subjects.map(() => false));

  const addUserSubject = (subject, subjectIndex) => {
    setLoadingState(true, subjectIndex);
    fetch('https://southamerica-east1-cloud-student-system.cloudfunctions.net/post-user-subject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('cloud-token')}` },
      body: JSON.stringify({ subjectId: subject.id })
    })
      .then(() => {
        subjects[subjectIndex].isenrolled = true;
        addSubject(subject);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingState(false, subjectIndex));
  }

  const deleteUserSubject = (subject, subjectIndex) => {
    setLoadingState(true, subjectIndex);
    fetch(`https://southamerica-east1-cloud-student-system.cloudfunctions.net/delete-user-subject?subjectId=${subject.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('cloud-token')}` }
    })
      .then(() => {
        subjects[subjectIndex].isenrolled = false;
        deleteSubject(subject)
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingState(false, subjectIndex));
  }

  const setLoadingState = (newState, indexToSet) => {
    const loadingState = loadingById.map((state, index) => index === indexToSet ? newState : state);
    setLoadingById(loadingState);
  }

  const renderIcon = (subject, subjectIndex) => {
    if(loadingById[subjectIndex]) {
      return (
      <Button disabled>
        <CircularProgress size={25} color={'primary'}/>
      </Button>
      );
    }
    return subject.isenrolled ?
      <Tooltip title={'Desanotarse'}>
        <Button onClick={() => deleteUserSubject(subject, subjectIndex)}>
          <Delete/>
        </Button>
      </Tooltip> :
      <Tooltip title={'Anotarse'}>
        <Button onClick={() => addUserSubject(subject, subjectIndex)}>
          <Add/>
        </Button>
      </Tooltip>
  }

  return (
    <TableContainer component={Paper} sx={{minWidth: 350, maxWidth: 650}}>
      <Table sx={{minWidth: 350, maxWidth: 650}}>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Acción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            subjects.map((subject, index) => (
              <TableRow key={subject.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{subject.id}</TableCell>
                <TableCell>{subject.name}</TableCell>
                <TableCell>
                  { renderIcon(subject, index) }
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SubjectsTable;