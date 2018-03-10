import React, { Component } from "react"
import axios from "axios"

import "./App.css"

const DEFAULT_QUERY = "redux"
const DEFAULT_HPP = "100"
const PATH_BASE = "https://hn.algolia.com/api/v1"
const PATH_SEARCH = "/search"
const PARAM_SEARCH = "query="
const PARAM_PAGE = "page="
const PARAM_HPP = "hitsPerPage="

const largeColumn = {
	width: "40%"
}

const midColumn = {
	width: "30%"
}

const smallColumn = {
	width: "10%"
}

class App extends Component {
	_isMounted = false
	
	constructor(props) {
		super(props)
		this.state = {
			
			results: null,
			searchKey: "",
			searchTerm: DEFAULT_QUERY,
			error: null,
			isLoading: false
		}
		
		this._isMounted = true
		this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this)
		this.onDismiss = this.onDismiss.bind(this)
		this.onSearchChange = this.onSearchChange.bind(this)
		this.setSearchTopStories = this.setSearchTopStories.bind(this)
		this.onSearchSubmit = this.onSearchSubmit.bind(this)
	}
	
	componentWillUnmount() {
		this._isMounted = false
	}
	
	componentDidMount() {
		this._isMounted = true
		const {searchTerm} = this.state
		this.fetchSearchTopStories(searchTerm)
	}
	
	fetchSearchTopStories(searchTerm, page = 0) {
		this.setState({isLoading: true})
		
		axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
			.then(result => this._isMounted && this.setSearchTopStories(result.data))
			.catch(error => this._isMounted && this.setState({error}))
	}
	
	needsToSearchTopStories(searchTerm) {
		return !this.state.results[searchTerm]
	}
	
	setSearchTopStories(result) {
		const {hits, page} = result
		const {searchKey, results} = this.state
		
		const oldHits = results && results[searchKey]
			? results[searchKey].hits
			: []
		
		const updatedHits = [
			...oldHits,
			...hits
		]
		
		this.setState({
			results: {
				...results,
				[searchKey]: {hits: updatedHits, page}
			},
			isLoading: false
		})
	}
	
	onSearchChange(event) {
		this.setState({searchTerm: event.target.value})
	}
	
	onSearchSubmit(event) {
		const {searchTerm} = this.state
		this.setState({searchKey: searchTerm})
		
		if (this.needsToSearchTopStories(searchTerm)) {
			this.fetchSearchTopStories(searchTerm)
		}
		event.preventDefault()
	}
	
	onDismiss(id) {
		const {searchKey, results} = this.state
		const {hits, page} = results[searchKey]
		const isNotId = item => item.objectID !== id
		const updatedHits = hits.filter(isNotId)
		
		this.setState({
			results: {
				...results,
				[searchKey]: {hits: updatedHits, page}
			}
		})
	}
	
	render() {
		const {
			searchTerm, searchKey, results, error, isLoading
		} = this.state
		
		const page = (
			results &&
			results[searchKey] &&
			results[searchKey].page
		) || 0
		
		const list = (
			results &&
			results[searchKey] &&
			results[searchKey].hits
		) || []
		
		return (
			<div className="page">
				<div className="interactions">
					<Search
						value={ searchTerm }
						onChange={ this.onSearchChange }
						onSubmit={ this.onSearchSubmit }
					>
						Search
					</Search>
					{ error
						? <div className="interactions">
							<p>Something went wrong.</p>
						</div>
						: <Table
							list={ list }
							onDismiss={ this.onDismiss }
						/>
					}
					
					<div className="interactions">
						<ButtonWithLoading
							isLoading={isLoading}
							onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
							More
						</ButtonWithLoading>
					</div>
				</div>
			
			</div>
		)
	}
}



// HOC

const Button = ({ onClick, className = '', children }) =>
	<button
		onClick={onClick}
		className={className}
		type="button"
	>
		{children}
	</button>

const Loading = () =>
	<div>Loading ...</div>

const withLoading = (Component) => ({ isLoading, ...rest }) =>
	isLoading
		? <Loading />
		: <Component { ...rest } />


const ButtonWithLoading = withLoading(Button);





class Search extends Component {
	componentDidMount() {
		this.input.focus()
	}
	
	render() {
		const {
			value,
			onChange,
			onSubmit,
			children
		} = this.props
		
		return (
			<form onSubmit={ onSubmit }>
				<input
					type="text"
					value={ value }
					onChange={ onChange }
					ref={ (node) => {
						this.input = node
					} }
				
				
				/>
				<button type="submit">
					{ children }
				</button>
			</form>
		)
		
	}
}


const Table = ({list, pattern, onDismiss}) =>
	<div className="table">
		{ list.map(item =>
			<div key={ item.objectID }>
        <span style={ largeColumn }>
              <a href={ item.url }>{ item.title }</a>
            </span>
				<span style={ midColumn }>
					{ item.author }</span>
				<span style={ smallColumn }>
					{ item.num_comments }</span>
				<span style={ smallColumn }>

					{ item.points }</span>
				<span style={ smallColumn }>
              <Button onClick={ () => onDismiss(item.objectID) }>
                Dismiss
              </Button>
            </span>
			</div>
		) }
	</div>



export default App

export {
	Button,
	Search,
	Table
}
