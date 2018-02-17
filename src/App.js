import React, {Component} from "react"
import "./App.css"

const isSearched = (searchTerm) => item =>
	item.title.toLowerCase().includes(searchTerm.toLowerCase())

const list = [
	{
		title: "React",
		url: "https://facebook.github.io/react/",
		author: "Jordan Walke",
		num_comments: 3,
		points: 4,
		objectID: 0
	},
	{
		title: "Redux",
		url: "https://github.com/reactjs/redux",
		author: "Dan Abramov, Andrew Clark",
		num_comments: 2,
		points: 5,
		objectID: 1
	}
]

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			list: list,
			searchTerm: ""
		}
		this.onDismiss = this.onDismiss.bind(this)
		this.onSearchChange = this.onSearchChange.bind(this)
		
	}
	
	onSearchChange(event) {
		this.setState({searchTerm: event.target.value})
	}
	
	onDismiss(id) {
		const isNotId = item => item.objectID !== id
		const updatedList = this.state.list.filter(isNotId)
		this.setState({list: updatedList})
	}
	
	render() {
		
		const {list, searchTerm} = this.state
		
		return (
			<div className="page">
				<div className="interactions">
					<Search
						value={searchTerm}
						onChange={this.onSearchChange}
					>
						Search
					
					</Search>
					
					<Table
						list={list}
						pattern={searchTerm}
						onDismiss={this.onDismiss}
					/>
				</div>
			
			</div>
		)
	}
}

const Search = ({value, onChange, children}) => {
	console.log(children)
	return(
		<form>
			<input
				type="text"
				value={value}
				onChange={onChange}
			/>
			{children}
		
		</form>
	
	
	)
}


const largeColumn = {
	width: "40%"
}

const midColumn = {
	width: "30%"
}

const smallColumn = {
	width: "10%"
}

const Table = ({list, pattern, onDismiss}) =>
	<div className="table">
		{list.filter(isSearched(pattern)).map(item =>
			<div key={item.objectID}>
        <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
				<span style={midColumn}>
					{item.author}</span>
				<span style={smallColumn}>
					{item.num_comments}</span>
				<span style={smallColumn}>

					{item.points}</span>
				<span style={smallColumn}>
              <Button onClick={() => onDismiss(item.objectID)}>
                Dismiss
              </Button>
            </span>
			</div>
		)}
	</div>

const Button = ({onClick, className = "", children}) =>
	<button
		onClick={onClick}
		className={className}
		type="button"
	>
		{children}
	</button>

export default App