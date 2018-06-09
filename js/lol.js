'use strict';

const x = ['1111', '5453'];
const z = [];
const link = 'file:///C:/Users/yapa6eu/Desktop/lol/index.html?share=todo=111$222$333$444$555$done=666$777$888$999$101010$';





class TodoList extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            todoList : this.linkSplitter(window.location)[0],
            doneList : this.linkSplitter(window.location)[1]
        }
    }
    linkMaker(arrToDo, arrDone) {
        let y = '?share=';
        y += 'todo=';
        for (const todo of arrToDo) {
            y += todo + '$';
        }
        y += 'done=';
        for (const done of arrDone) {
            y += done + '$';
        }
        const link = window.location.protocol + '//' + window.location.host + window.location.pathname + y;
        console.log(link)
        return link;
    }
    linkSplitter(location) {
        let link = decodeURIComponent(location.toString());
        if (link.indexOf('?share=') == -1) {
            return [[], []];
        }
        let indexShare = link.indexOf('?share=') + 7;
     
        let q = link.substring(indexShare);
        let todo = q.split('todo=')[1].split('done=')[0].split('$');
        todo.length = (todo.length - 1);
        if (todo[0] == '') {
            todo = [];
        }
        let done = q.split('todo=')[1].split('done=')[1].split('$');
        done.length = (done.length - 1);
        let arr = []
        arr.push(todo)
        arr.push(done);
        return arr;
    }
    btnClick(event) {
        if (event.currentTarget.parentElement.children[0].value == '') {
            return null;
        }
        const newList = this.state.todoList;
        newList.push(event.currentTarget.parentElement.children[0].value)
        this.setState({todoList : newList})
        event.currentTarget.parentElement.children[0].value = '';
        window.location = this.linkMaker(this.state.todoList, this.state.doneList);
    }
    moveToDone(event) {
        const movingEl = event.currentTarget.textContent;
        const newList = this.state.doneList;
        newList.push(movingEl);
        this.setState( {todoList : this.delFrmArr(this.state.todoList, movingEl)} );
        this.setState( {doneList : newList});
    }
    delFrmArr(arr, delEl) {
        let newArr = [];
        for (const el of arr) {
            if (el != delEl) {
                newArr.push(el);
            }    
        }
        return newArr;
    }
    enterSubmit(event) {
        if (event.key == 'Enter') {
            
            this.btnClick(event);
        }
    }
    render() {
        
        return (
            <main className="main">
                <h2 className="title">Todo List</h2>
                <section className="todo wrap">
                    <h3 className="todo title">Todo</h3>
                    <ul className="todo list">
                        {
                            this.state.todoList.map((el) => {
                                return <li onClick={this.moveToDone.bind(this)}>{el}</li>
                            })
                        }
                    </ul>
                </section>
                <section className="done wrap">
                    <h3 className="done title">Done</h3>
                    <ul className="done list">
                        {
                            this.state.doneList.map((el) => {
                                return <li>{el}</li>
                            })
                        }
                    </ul>
                </section>
                <section>
                <input className='add-new' type='text' onKeyUp={this.enterSubmit.bind(this)}/>
                <button onClick={this.btnClick.bind(this)} > Click </button>
                </section>
            </main>
        )
    }
}



ReactDOM.render(<TodoList />, document.getElementById('wrapper'));