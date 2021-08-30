import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import YouTubePlayer from "react-youtube";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Header from "../../common/header/Header";
import "./Details.css";

const Details = (props) => {
  const [movieDetails, setMovieDetails] = useState({});
  const [title, setTitle] = useState("");
  const [genres, setGenres] = useState("");
  const [duration, setDuration] = useState("");
  const [release_date, setReleaseDate] = useState("");
  const [critics_rating, setCritics_rating] = useState("");
  const [story_line, setStory_line] = useState("");
  const [trailer_url, setTrailer_url] = useState("");
  const [wiki_url, setWikiUrl] = useState("");
  const [artists, setArtists] = useState([]);
  const [userRating, setUserRating] = useState(0);

  const userRatingChangeHandler = (index) => {
    setUserRating(index + 1);
  };

  useEffect(() => {
    let movieDetailsObj = null;

    fetch(props.baseUrl + "movies/" + props.match.params.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: movieDetailsObj,
    })
      .then((response) => response.json())
      .then((response) => {
        setMovieDetails(response);
        setTitle(response.title);
        setGenres(response.genres);
        setDuration(response.duration);
        setReleaseDate(new Date(response.release_date).toDateString());
        setCritics_rating(response.rating);
        setStory_line(response.storyline);
        setTrailer_url(response.trailer_url);
        setWikiUrl(response.wiki_url);
        setArtists(response.artists);
      });
  }, []);

  return (
    <div>
      <Header
        baseUrl={props.baseUrl}
        isMovieDetailsPage
        movieId={props.match.params.id}
      />
      <Typography
        className="backToHome"
        style={{ margin: "8px auto 0px 24px" }}
      >
        <Link to={"/"}>&#60; Back to Home</Link>
      </Typography>
      <div className="detailsContainer">
        <div className="leftPane">
          <img src={movieDetails.poster_url} />
        </div>
        <div className="midPane">
          <Typography component={"h2"} variant="headline">
            {title}
          </Typography>
          <Typography>
            <strong>Genres: </strong>
            <span>{genres && genres.join(", ")}</span>
          </Typography>
          <Typography>
            <strong>Duration: </strong>
            <span>{duration}</span>
          </Typography>
          <Typography>
            <strong>Release Date: </strong>
            <span>{release_date}</span>
          </Typography>
          <Typography>
            <strong>Rating: </strong>
            <span>{critics_rating}</span>
          </Typography>
          <Typography style={{ marginTop: "16px" }}>
            <strong>Plot: </strong>
            <span>
              <a href={wiki_url}>(Wiki Link)</a> {story_line}
            </span>
          </Typography>
          <Typography component={"span"} style={{ marginTop: "16px" }}>
            <strong>Trailer: </strong>
            <YouTubePlayer
              videoId={trailer_url && trailer_url.split("v=")[1].split("&")[0]}
            />
          </Typography>
        </div>
        <div className="rightPane">
          <Typography component={"p"}>
            <strong>Rate this movie:</strong>
          </Typography>
          <div>
            {[...Array(5)].map((x, i) => (
              <StarBorderIcon
                nativeColor={i < userRating ? "yellow" : "black"}
                onClick={() => {
                  userRatingChangeHandler(i);
                }}
                key={i}
              />
            ))}
          </div>
          <Typography
            component={"span"}
            style={{ marginTop: "16px", marginBottom: "16px" }}
          >
            <strong>Artists: </strong>
            <GridList cols={2}>
              {artists &&
                artists.map((artist) => (
                  <GridListTile key={artist.id}>
                    <img src={artist.profile_url} />
                    <GridListTileBar
                      title={`${artist.first_name} ${artist.last_name}`}
                    />
                  </GridListTile>
                ))}
            </GridList>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Details;
