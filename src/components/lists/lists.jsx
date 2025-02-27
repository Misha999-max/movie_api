import { useState } from 'react';
import PropTypes from 'prop-types';
import { Flex, Rate } from 'antd';

// import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import './lists.css';
function Lists({ item, genres, handleRateClick }) {
  const [value, setValue] = useState(0);
  const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
  const genresNmae = item.genre_ids.map((id) => genres.find((genre) => genre.id === id)).filter(Boolean);

  function handleChangeValu(num) {
    handleRateClick(item.id, num);
    setValue(num);
  }
  return (
    <li className="movie__block-item">
      <div className="movie__block-item-img">
        <img src={`${BASE_IMAGE_URL}${item.poster_path}`} alt={item.original_title} />
      </div>
      <div className="movie__block-item-info">
        <h3>{item.original_title}</h3>
        <span>Релиз:{item.release_date}</span>
        <div
          className={
            item.vote_average < 5
              ? 'border_rate_low'
              : item.vote_average < 7
                ? 'border_rate_medium'
                : 'border_rate_high'
          }
        >
          {item.vote_average.toFixed(1)}
        </div>
        <div className="movie__block-item-info-genres">
          {genresNmae.map((genre) => {
            return <span key={genre.id}>{genre.name}</span>;
          })}
        </div>
        <p>
          {item.overview ? (
            item.overview
          ) : (
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita nemo laboriosam accusamus deleniti et
              placeat autem, illum ipsa nesciunt architecto nulla magni suscipit alias totam, corrupti quos eum porro,
              voluptates ducimus! Blanditiis amet sunt quia, repellendus at, dignissimos animi in alias provident
              ratione fugit natus? Accusamus, iste est! Reiciendis suscipit repellendus qui dolores possimus neque
              libero illo inventore ipsum at alias optio, magnam delectus provident perspiciatis ipsa. Incidunt
              voluptate fugiat nihil, dolor ipsa assumenda cumque maxime ratione nobis. Doloremque, eum praesentium.
              Nobis ratione nostrum rerum vitae cupiditate molestias vel hic atque velit dolor id unde, voluptatibus
              beatae. Suscipit perferendis itaque harum ducimus? Dolorem at tenetur accusantium, dignissimos consectetur
              nihil sapiente quos neque fugit amet ducimus cumque, sunt vel possimus et! Aperiam sequi voluptates, nulla
              iusto placeat nostrum in consectetur nihil fuga quasi soluta ipsam neque ullam laboriosam voluptatem ipsa
              consequatur alias earum iure ipsum. Recusandae iusto temporibus minima saepe vitae.
            </p>
          )}
        </p>
        {
          <Flex gap="middle" vertical>
            <Rate
              allowHalf
              defaultValue={item.vote_average}
              count={10}
              color="rgb(28, 202, 217)"
              value={value}
              style={{
                fontSize: 28,
                color: 'rgb(28, 202, 217)',
                backgroundColor: 'transparent',
              }}
              onChange={(num) => handleChangeValu(num)}
              character={({ index = { value } }) => [index + 1]}
            />
          </Flex>
        }
      </div>
    </li>
  );
}

Lists.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    poster_path: PropTypes.string.isRequired,
    vote_average: PropTypes.number.isRequired,
    original_title: PropTypes.string.isRequired,
    release_date: PropTypes.string.isRequired,
    overview: PropTypes.string,
    genre_ids: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  handleRateClick: PropTypes.func.isRequired,
};

export default Lists;
