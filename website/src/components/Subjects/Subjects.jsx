import React, {useState} from 'react';
import { useEffect } from 'react';
import {CircularProgress} from "@mui/material";
import UserSubject from "./UserSubject";
import SubjectsTable from "./SubjectsTable";
import UserSubjectsGrid from "./UserSubjectsGrid";

const Subjects = ({

}) => {

  const [loading, setLoading] = useState(true);
  const [allSubjects, setAllSubjects] = useState(null);
  const [userSubjects, setUserSubjects] = useState(null);

  const getOptions = {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('cloud-token')}`
    }
  }

  useEffect(() => {
    Promise.all([
      getAllSubjects(),
      getUserSubjects(),
    ])
      .then(res => Promise.all([res[0].json(), res[1].json()]))
      .then(res => {
        setAllSubjects(res[0].msg);
        setUserSubjects(res[1].msg);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getAllSubjects = () => fetch('https://southamerica-east1-cloud-student-system.cloudfunctions.net/get-all-subjects', getOptions);

  const getUserSubjects = () => fetch('https://southamerica-east1-cloud-student-system.cloudfunctions.net/get-user-subjects', getOptions);

  const addSubject = subject => setUserSubjects([...userSubjects, subject])

  const deleteSubject = subject => {
    setUserSubjects(userSubjects.filter(s => s.id !== subject.id));
    setAllSubjects(allSubjects.map(s => {
      if(s.id === subject.id) {
        return {
          ...s,
          isenrolled: false,
        }
      } else {
        return s;
      }
    }))
  }

  return (
    <div>
      {
        loading &&
        <CircularProgress size={50} color={'primary'}/>
      }
      {
        !loading && userSubjects?.length > 0 &&
        <div style={{margin: '20px 10px'}}>
          <h3>Materias en las que usted está inscripto:</h3>
          <UserSubjectsGrid subjects={userSubjects} deleteSubject={deleteSubject}/>
        </div>
      }
      {
        !loading && allSubjects?.length > 0 &&
        <div style={{margin: '20px 10px'}}>
          <h3>Todas las materias:</h3>
          <SubjectsTable subjects={allSubjects} addSubject={addSubject} deleteSubject={deleteSubject}/>
        </div>
      }
    </div>
  );
}

export default Subjects;