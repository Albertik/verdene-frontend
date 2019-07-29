import React from 'react';
import agent from '../../agent';

const Tags = props => {
	const tags = props.tags;
	if (tags) {
		return (
			<div className="tag-list">
				{tags.length === 0 ? (
					<div>There no tags yet...</div>
				) : (
					tags.map(tag => {
						const handleClick = ev => {
							ev.preventDefault();
							props.onClickTag(tag, page => agent.Articles.byTag(tag, page), agent.Articles.byTag(tag));
						};

						return (
							<a href="" className="tag-default tag-pill" key={tag} onClick={handleClick}>
								{tag}
							</a>
						);
					})
				)}
			</div>
		);
	} else {
		return <div>Loading Tags...</div>;
	}
};

export default Tags;
