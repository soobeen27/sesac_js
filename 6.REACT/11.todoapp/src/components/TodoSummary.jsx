export default function TodoSummary({ all, done }) {
  return (
    <h4>
      전체: {all}/ 완료: {done}
    </h4>
  );
}
