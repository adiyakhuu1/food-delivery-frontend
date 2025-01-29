"use client";

type Props = {
  checking: string;
};

export default function Checking(props: Props) {
  const categoryFromParams = props.checking;
  return (
    <div
      onClick={() => {
        console.log(categoryFromParams);
      }}
    >
      click here
    </div>
  );
}
