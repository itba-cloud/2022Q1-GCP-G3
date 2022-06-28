import React, {useState} from 'react';
import UserSubject from "./UserSubject";

const UserSubjectsGrid = ({
  subjects,
  deleteSubject
}) => {

  return (
    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
      {
        subjects.map(subject => (
          <UserSubject subject={subject} deleteSubject={deleteSubject} />
        ))
      }
    </div>
  );
}

export default UserSubjectsGrid;