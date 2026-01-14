export default function SearchResult({ results }) {
  return (
    <ul>
      {results.map((item, index) => (
        <li key={index}>
          <h5>
            <a href={item.link} target="_blank" dangerouslySetInnerHTML={{ __html: item.title }} />
          </h5>
          <p dangerouslySetInnerHTML={{ __html: item.description }} />
          <small dangerouslySetInnerHTML={{ __html: item.postdate }} />
        </li>
      ))}
    </ul>
  );
}
