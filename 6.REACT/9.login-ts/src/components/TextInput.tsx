interface TextInputProps {
    label: string;
    name: string;
    value: string;
    type?: string;
    onChange: (name: string, value: string) => void;
}
export default function TextInput({ label, name, type = 'text', value, onChange }: TextInputProps) {
    return (
        <label>
            {label}
            <input name={name} value={value} type={type} onChange={(e) => onChange(name, e.target.value)} />
        </label>
    );
}
