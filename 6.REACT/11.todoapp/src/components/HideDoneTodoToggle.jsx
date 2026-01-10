export default function HideDoneTodoToggle({ onCheck }) {
  return (
    <span>
      <input
        type="checkbox"
        onChange={(e) => {
          onCheck(e.target.checked);
        }}
      />
      완료 항목 숨기기
    </span>
  );
}
