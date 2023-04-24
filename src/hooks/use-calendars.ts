import * as React from "react";
import * as calendar from "@/utils/calendar";

import { useFocusEffect } from "@react-navigation/native";

import { CALENDAR_REDUCER_TYPES } from "@/utils/constants";

const INITIAL_STATE = {
  calendars: [],
  events: [],
  currentDate: new Date(),
  currentCalendarId: "all",
  defaultCalendarId: "",
};

const useCalendars = () => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);

  const reset = (date: Date) => {
    dispatch({ type: CALENDAR_REDUCER_TYPES.SET_CURRENT_DATE, payload: date });
    dispatch({
      type: CALENDAR_REDUCER_TYPES.SET_CURRENT_CALENDAR_ID,
      payload: INITIAL_STATE.currentCalendarId,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      calendar.getCalendars().then((calendars) => {
        dispatch({
          type: CALENDAR_REDUCER_TYPES.UPDATE_CALENDARS,
          payload: { calendars },
        });
      });
    }, [])
  );

  React.useEffect(() => {
    calendar.getDefaultCalendarId().then((calendarId) => {
      dispatch({
        type: CALENDAR_REDUCER_TYPES.SET_DEFAULT_CALENDAR_ID,
        payload: calendarId,
      });
    });
  }, []);

  React.useEffect(() => {
    (async () => {
      const calendars = await calendar.getCalendars();
      const events = await calendar.getEvents(
        calendars,
        state.currentDate,
        state.currentCalendarId
      );

      dispatch({
        type: CALENDAR_REDUCER_TYPES.UPDATE_CALENDARS,
        payload: { calendars, events },
      });
    })();
  }, [state.currentDate, state.currentCalendarId]);

  const removeEvent = async (id: string) => {
    calendar.deleteEvent(id).then(async () => {
      const events = await calendar.getEvents(
        state.calendars,
        state.currentDate,
        state.currentCalendarId
      );

      dispatch({
        type: CALENDAR_REDUCER_TYPES.UPDATE_CALENDARS,
        payload: { events },
      });
    });
  };

  return {
    reset,
    removeEvent,
    state,
    dispatch,
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case CALENDAR_REDUCER_TYPES.UPDATE_CALENDARS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case CALENDAR_REDUCER_TYPES.SET_CURRENT_DATE: {
      return {
        ...state,
        currentDate: action.payload,
      };
    }
    case CALENDAR_REDUCER_TYPES.SET_DEFAULT_CALENDAR_ID: {
      return {
        ...state,
        defaultCalendarId: action.payload,
      };
    }
    case CALENDAR_REDUCER_TYPES.SET_CURRENT_CALENDAR_ID: {
      return {
        ...state,
        currentCalendarId: action.payload,
      };
    }
  }
  throw Error("Unknown action: " + action.type);
};

export default useCalendars;
