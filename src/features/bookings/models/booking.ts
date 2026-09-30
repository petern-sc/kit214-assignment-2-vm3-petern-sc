export type Booking = {
  id: string;
  name: string;
  roomId: string;
  startTime: string;
  endTime: string;
  userId: string;
  invitedUserIds: string[];
};

export type BookingRecord = {
  id: string;
  name: string;
  room_id: string;
  start_time: Date;
  end_time: Date;
  user_id: string;
};
