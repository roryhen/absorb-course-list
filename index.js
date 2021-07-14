import { writeFile, mkdir } from 'fs/promises';
import { parseAsync } from 'json2csv';
import getAbsorb from './getAbsorb.js';

// Setup
const now = new Date();
const month = now.getMonth();
const day = now.getDate();
const year = now.getFullYear();
const options = { fields: ['Name', 'Urls'] };

// Create directory
try {
  await mkdir('data');
} catch (err) {
  if (err.code === 'EEXIST') {
    console.log('Directory already exists');
  } else {
    console.log(err);
  }
}

try {
  // Fetch course list
  const courseData = await getAbsorb('OnlineCourses');
  console.log('Fetching course data');
  // get only what we need
  const courses = courseData.map(({ Name, ChapterIds }) => {
    return { Name, ChapterIds };
  });

  // Fetch lesson list
  const lessonData = await getAbsorb('Lessons');
  console.log('Fetching lesson data');
  // get only what we need
  const lessons = lessonData.map(({ ChapterId, Url }) => {
    return { ChapterId, Url };
  });

  // Create final list
  const masterList = courses.map((course) => {
    const search = (id) => lessons.find((lesson) => lesson.ChapterId === id);

    // Get the matching lesson url for each course chapter
    const urls = course.ChapterIds.map((id) => {
      const res = search(id);
      return res ? res.Url : null;
    });

    return {
      Name: course.Name,
      Urls: [...urls],
    };
  });

  // Convert json to csv
  const csv = await parseAsync(masterList, options);

  // Create file
  await writeFile(`./data/MasterList-${month}-${day}-${year}.csv`, csv);
  console.log('File written.');
} catch (err) {
  console.error(err);
}
