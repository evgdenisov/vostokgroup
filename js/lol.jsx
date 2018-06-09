'use strict';


class Accordion extends React.Component {

    render() {
        const sectionHeads = [
            'Компоненты',
            'Выучил раз, используй везде!',
            'Использование JSX',
        ]
        const articles = [
            'Каждый компонент являются законченной частью пользовательского интерфейса и сам управляет своим состоянием, а композиция компонентов (соединение) позволяет создавать более сложные компоненты. Таким образом, создается иерархия компонентов, причем каждый отдельно взятый компонент независим сам по себе. Такой подход позволяет строить сложные интерфейсы, где есть множество состояний, и взаимодействовать между собой.',
            'После изучения React вы сможете использовать его концепции не только в браузере, но также и при разработке мобильных приложений с использованием React Native.',
            'JSX является языком, расширяющим синтаксис стандартного Javascript. По факту он позволяет писать HTML-код в JS-скриптах. Такой подход упрощает разработку компонентов и повышает читаемость кода.',
        ]
        const sections = [];
        for (let i = 0; i < sectionHeads.length; i++) {
            sections.push(<Section sectionHead={sectionHeads[i]} article={articles[i]} key={i}/>);
        }
        return (
            <main className="main">
                <h2 className="title">React</h2>
                {sections}
            </main>
        )
    }
}

function Section(props) {
    const { article, sectionHead } = props;
    return (
    <section className="section" onClick={onClick}>
    <button>toggle</button>
    <h3 className="sectionhead">{sectionHead}</h3>
    <div className="articlewrap">
      <div className="article">
        {article}
      </div>
    </div>
  </section>
    )
}

function onClick(event) {
    if (event.currentTarget.className == 'section') {
        event.currentTarget.className = 'section open';
    }
    else {
        event.currentTarget.className = 'section';
    }
}

ReactDOM.render(<Accordion />, document.getElementById('accordian'));