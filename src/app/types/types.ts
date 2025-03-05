export type response = {
  success: boolean;
  code: string;
  message: string;
  data: {
    id?: string;
    email?: string;
    password?: string;
  } | null;
};
