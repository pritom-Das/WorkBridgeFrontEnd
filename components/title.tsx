type TitleProps = {
text: string;
};

export default function Title({ text }: TitleProps) {
return <h2 style={{ marginBottom: "15px" }}>{text}</h2>;
}