import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';

const Home = () => {
  return (
    <>
    <Navbar />

    <div className='container mx-auto'></div>

    <NoteCard
  title="Sample Note"
  date="2023-05-30"
  content="This is the content of the note."
  tags={['tag1', 'tag2']}
  isPinned={false}
  onEdit={() => {}}
  onDelete={() => {}}
  onPinNote={() => {}}
/>
    </>
  );
};

export default Home;
