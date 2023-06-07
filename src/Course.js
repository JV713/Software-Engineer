import * as React from 'react';
import { useMediaQuery } from '@mui/material';
import { useState } from 'react';

import {
  Datagrid,
  List,
  ReferenceField,
  TextField,
  EditButton,
  Edit,
  SimpleForm,
  ReferenceInput,
  SelectInput,
  TextInput,
  TimeInput,
  Create,
  BooleanInput,
  DateInput,
  RadioButtonGroupInput,
  useRecordContext,
  SimpleList,
  DeleteButton,

} from 'react-admin';

const CourseFilters = [
  <TextInput source="q" label="Search" alwaysOn />,
  <ReferenceInput source="User" reference="users">
    <SelectInput optionText="name" />
  </ReferenceInput>,
];

let dummyCourses = [
  { id: 1, User: 1, title: 'Dummy Course 1', body: 'Lorem ipsum dolor sit amet' },
  { id: 2, User: 2, title: 'Dummy Course 2', body: 'Lorem ipsum dolor sit amet' },
];

export const CourseList = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <List filters={CourseFilters} {...props}>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.title}
          secondaryText={(record) => `${record.views} views`}
          tertiaryText={(record) => new Date(record.published_at).toLocaleDateString()}
        />
      ) : (
        <Datagrid>
          <TextField source="id" />
          <ReferenceField source="User" reference="users" linkType="show">
            <TextField source="name" />
          </ReferenceField>
          <TextField source="title" />
          <TextField source="body" />
          <EditButton />
          <DeleteButton />
        </Datagrid>
      )}
    </List>
  );
};

const CourseTitle = (props) => {
  const record = useRecordContext();
  return <span>Course {record ? `${record.title} by ${record.User?.name}` : ''}</span>;
};

export const CourseEdit = (props) => (
  <Edit title={<CourseTitle />} {...props}>
    <SimpleForm>
      <ReferenceInput source="User" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="id" disabled />
      <TextInput source="title" />
      <TextInput multiline source="body" />
    </SimpleForm>
  </Edit>
);


export const CourseCreate = (props) => {
  const [venueValue, setVenueValue] = useState('online');
  const [feePaymentValue, setFeePaymentValue] = useState(false);

  const handleVenueChange = (event) => {
    setVenueValue(event.target.value);
  }; 

  const handleFeePaymentChange = (event) => {
    setFeePaymentValue(event.target.value);
  };

  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="Lecturer Name" />
        <TextInput multiline source="Lecture Details" />
        <TextInput multiline source="prerequisites" />
        <BooleanInput label="Fee payment" source="feePayment" onChange={handleFeePaymentChange} />

        {feePaymentValue && (
          <TextInput source="fee" />
        )}

        <DateInput source="fromDate" label="From Date" />
        <DateInput source="toDate" label="To Date" />
        <TimeInput source="fromTime" label="From Time" />
        <TimeInput source="toTime" label="To Time" />
        <RadioButtonGroupInput
          source="venue"
          choices={[
            { id: 'online', name: 'Online' },
            { id: 'offline', name: 'Offline' },
          ]}
          value={venueValue}
          onChange={handleVenueChange}
        />

        {venueValue === 'online' ? (
          <TextInput source="Venue" label="Venue" disabled={true} />
        ) : (
          <TextInput source="Venue" label="Venue" />
        )}

        {venueValue === 'offline' ? (
          <TextInput source="Link" label="Link" disabled={true} />
        ) : (
          <TextInput source="Link" label="Link" />
        )}
        
      </SimpleForm>
    </Create>
  );
};



export const dataProvider = {
	// Existing methods...
  
	deleteMany: (resource, params) => {
	  const { ids } = params;
  
	  if (resource === 'courses') {
		dummyCourses = dummyCourses.filter((course) => !ids.includes(course.id));
		return Promise.resolve({ data: ids });
	  }
  
	  // Handle deletion for other resources
	  // Add conditions for other resources and implement their deletion logic here
  
	  return Promise.reject(new Error('Resource not found'));
	},
  };
  
