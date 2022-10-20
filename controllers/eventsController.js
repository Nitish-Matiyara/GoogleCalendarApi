const { calendar, oAuth2Client } = require("../Authentication");
const router = require("../routes/eventsApiRoute");

// Function to convert the date into the format that Google Calendar API needs
// const TIMEOFFSET = "+5:30";
// const dateTimeforCalendar = () => {
//   const date = new Date();
//   const year = date.getFullYear();
//   let month = date.getMonth() + 1;
//   if (month < 10) {
//     month = `0${month}`;
//   }
//   let day = date.getDate();
//   if (day < 10) {
//     day = `0${day}`;
//   }
//   let hour = date.getHours();
//   if (hour < 10) {
//     hour = `0${hour}`;
//   }
//   let minute = date.getMinutes();
//   if (minute < 10) {
//     minute = `0${minute}`;
//   }

//   const newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;
//   const event = new Date(Date.parse(newDateTime));

//   const startDate = event;
//   const endDate = new Date(
//     new Date(startDate).setHours(startDate.getHours() + 1)
//   );

//   return {
//     start: startDate,
//     end: endDate,
//   };
// };

// let dateTime = dateTimeforCalendar();

// // Event for Google Calendar
// let event = {
//   summary: `Meeting to discuss GoogleApi Integration`,
//   location: `Globussoft, Bhilai`,
//   description: `Incorporate Calendar, Drive, Mail apis into Empmonitor. Where employees can track, schedule events.`,
//   colorId: 1,
//   start: {
//     dateTime: dateTime["start"],
//     timeZone: "Asia/Kolkata",
//   },
//   end: {
//     dateTime: dateTime["end"],
//     timeZone: "Asia/Kolkata",
//   },
//   attendees: [
//     { email: "matiyaranitish@gmail.com" },
//     { email: "johnathank577@gmail.com" },
//   ],
// };

// CREATE/INSERT event
const insertNewEvent = async (event) => {
  try {
    const response = await calendar.events.insert({
      auth: oAuth2Client,
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: event.body,
      conferenceDataVersion: 1,
    });

    if (response["status"] == 200 && response["statusText"] === "OK") {
      return "Event Inserted Successfully";
    } else {
      return "Failed to Insert Event";
    }
  } catch (error) {
    return `Error at InsertEvent ---> ${error}`;
  }
};

// Check Event Already present/not with FREEBUSY Query then insert
const insertEvent = async (event) => {
  try {
    const { start, end } = event.body;
    const primary = process.env.GOOGLE_CALENDAR_ID;
    const res = await calendar.freebusy.query({
      resource: {
        timeMin: start.dateTime,
        timeMax: end.dateTime,
        timeZone: "Asia/Kolkata",
        items: [{ id: primary }],
      },
    });

    // Create an array of all events on our calendar during that time.
    const eventArr = res.data.calendars[`${primary}`].busy;

    // Check if event array is empty which means we are not busy
    if (eventArr.length === 0) {
      // If we are not busy create a new calendar event.
      const insert = await insertNewEvent(event);
      return insert;
    }

    // If event array is not empty log that we are busy.
    return `Sorry I'm busy...`;
  } catch (err) {
    // Check for errors in our query and log them if they exist.
    return `Free Busy Query Error: ${err}`;
  }
};

// READ/GET All Events between two dates
const getAllEvents = async (start, end) => {
  try {
    const response = await calendar.events.list({
      auth: oAuth2Client,
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: start,
      timeMax: end,
      timeZone: "Asia/Kolkata",
    });

    const items = response["data"]["items"];
    return items;
  } catch (error) {
    return `Error at getEvents --> ${error}`;
  }
};

//READ Single Event with EventId
const getSingleEvent = async (eventId) => {
  try {
    const response = await calendar.events.get({
      auth: oAuth2Client,
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId: eventId,
      conferenceDataVersion: 1,
    });
    const items = response["data"];
    return items;
  } catch (error) {
    return `Error at getEvent --> ${error}`;
  }
};

//DELETE an Event from eventId
const deleteEvent = async (eventId) => {
  try {
    const response = await calendar.events.delete({
      auth: oAuth2Client,
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId: eventId,
    });

    if (response.data === "") {
      return "Event deleted successfully";
    } else {
      return "Error in deleting event";
    }
  } catch (error) {
    return `Error at deleteEvent ---> ${error}`;
  }
};

//UPDATE event with eventId
const updateEvent = async (eventId, req) => {
  try {
    const response = await calendar.events.patch({
      auth: oAuth2Client,
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId: eventId,
      resource: req.body,
    });
    if (response["status"] == 200 && response["statusText"] === "OK") {
      return "Event Updated Successfully";
    } else {
      return "Failed to Update Event";
    }
  } catch (error) {
    return `Error at updateEvent ---> ${error}`;
  }
};

module.exports = {
  dateTime,
  event,
  getAllEvents,
  insertEvent,
  deleteEvent,
  getSingleEvent,
  updateEvent,
};
