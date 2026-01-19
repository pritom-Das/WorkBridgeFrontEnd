interface ProfileProps {
  name: string;
  age: number;
}

export default function Profile(props: ProfileProps) {
  return (
    <div>
      <h2>Hello, {props.name}!</h2>
      <p>Age: {props.age}</p>
    </div>
  );
}
