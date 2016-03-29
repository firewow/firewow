/**
 * Class
 */
export default class Application extends React.Component {

	/**
	 * Render
	 */
	render() {
		return (
			<div className="app">
				{this.props.children}
			</div>
		);
	}
}
