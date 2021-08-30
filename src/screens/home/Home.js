import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Header from "../../common/header/Header";
import "./Home.css";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";

const Home = (props) => {
  const { classes, currentUser, images } = props;

  const [releasedMovies, setReleasedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [filteredReleasedMovies, setFilteredReleasedMovies] = useState([]);

  const filterTextChangeHandler = (event) => {
    setFilterText(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDateFilter(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDateFilter(event.target.value);
  };

  const isArtistChecked = (artistID) => {
    const foundEl =
      selectedArtists &&
      selectedArtists.find((artist) => {
        return artist.id === artistID;
      });

    return !!foundEl;
  };

  const toggleSelectedArtists = (artistID) => {
    const found = isArtistChecked(artistID);

    if (found) {
      const updatedArtistsSelected = selectedArtists.filter(
        (artist) => artist.id !== artistID
      );
      setSelectedArtists(updatedArtistsSelected);
    } else {
      const tempSelectionObj = [...selectedArtists];
      tempSelectionObj.push(
        artists &&
          artists.find((artist) => {
            return artist.id === artistID;
          })
      );
      setSelectedArtists(tempSelectionObj);
    }
  };

  const isGenreChecked = (genreID) => {
    const foundEl =
      selectedGenres &&
      selectedGenres.find((genre) => {
        return genre.id === genreID;
      });

    return !!foundEl;
  };

  const toggleSelectedGenres = (genreID) => {
    const found = isGenreChecked(genreID);

    if (found) {
      const updatedGenresSelected = selectedGenres.filter(
        (genre) => genre.id !== genreID
      );
      setSelectedGenres(updatedGenresSelected);
    } else {
      const tempSelectionObj = [...selectedGenres];
      tempSelectionObj.push(
        genres &&
          genres.find((genre) => {
            return genre.id === genreID;
          })
      );
      setSelectedGenres(tempSelectionObj);
    }
  };

  const filterResults = () => {
    const allMovies = [...releasedMovies];

    if (
      selectedGenres.length === 0 &&
      selectedArtists.length === 0 &&
      !filterText &&
      !startDateFilter &&
      !endDateFilter
    ) {
      setFilteredReleasedMovies(allMovies);
    } else {
      // filter by genre
      let newlyFilteredMoviesByGenre = selectedGenres.length
        ? releasedMovies.filter((movie) => {
            return movie.genres.some((genre) => {
              const genreNames = selectedGenres.map((selGen) => selGen.genre);
              return genreNames.includes(genre);
            });
          })
        : [...releasedMovies];

      let newlyFilteredMoviesByArtist = selectedArtists.length
        ? releasedMovies.filter((movie) => {
            return movie.artists.some((artist) => {
              const artistIDs = selectedArtists.map((selArt) => selArt.id);
              return artistIDs.includes(artist.id);
            });
          })
        : [...releasedMovies];

      let newlyFilteredMoviesByName = filterText
        ? releasedMovies.filter((movie) => {
            return (
              movie.title.toUpperCase().indexOf(filterText.toUpperCase()) != -1
            );
          })
        : [...releasedMovies];

      let filterStartDate = new Date(startDateFilter);
      let newlyFilteredMoviesByStartDate = startDateFilter
        ? releasedMovies.filter((movie) => {
            let movieReleaseDate = new Date(movie.release_date);
            return movieReleaseDate.getTime() >= filterStartDate.getTime();
          })
        : [...releasedMovies];

      let filterEndDate = new Date(endDateFilter);
      let newlyFilteredMoviesByEndDate = endDateFilter
        ? releasedMovies.filter((movie) => {
            let movieReleaseDate = new Date(movie.release_date);
            return movieReleaseDate.getTime() <= filterEndDate.getTime();
          })
        : [...releasedMovies];

      let currentlyFilteredMovies = [
        ...new Set([
          ...newlyFilteredMoviesByArtist,
          ...newlyFilteredMoviesByGenre,
          ...newlyFilteredMoviesByName,
          ...newlyFilteredMoviesByStartDate,
          ...newlyFilteredMoviesByEndDate,
        ]),
      ];
      let arrays = [
        newlyFilteredMoviesByArtist,
        newlyFilteredMoviesByGenre,
        newlyFilteredMoviesByName,
        newlyFilteredMoviesByStartDate,
        newlyFilteredMoviesByEndDate,
      ];
      setFilteredReleasedMovies(
        arrays.shift().filter(function (v) {
          return arrays.every(function (a) {
            return a.indexOf(v) !== -1;
          });
        })
      );
    }
  };

  useEffect(() => {
    let moviesList = null,
      movies = [];

    fetch(props.baseUrl + "movies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: moviesList,
    })
      .then((response) => response.json())
      .then((response) => {
        movies = response.movies;
        setReleasedMovies(movies.filter((movie) => movie.status == "RELEASED"));
        setFilteredReleasedMovies(
          movies.filter((movie) => movie.status == "RELEASED")
        );
        setUpcomingMovies(
          movies.filter((movie) => movie.status == "PUBLISHED")
        );
      });

    let genresObj = null;
    fetch(props.baseUrl + "genres", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: genresObj,
    })
      .then((response) => response.json())
      .then((response) => {
        setGenres(response.genres);
      });

    let artistsObj = null;
    fetch(props.baseUrl + "artists", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: artistsObj,
    })
      .then((response) => response.json())
      .then((response) => {
        setArtists(response.artists);
      });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header baseUrl={props.baseUrl} />
      <div className="heading">Upcoming movies</div>

      <GridList cellHeight={250} cols={6} style={{ flexWrap: "nowrap" }}>
        {upcomingMovies &&
          upcomingMovies.map((upcomingMovie) => (
            <GridListTile key={upcomingMovie.id}>
              <img src={upcomingMovie.poster_url} />
              <GridListTileBar title={upcomingMovie.title} />
            </GridListTile>
          ))}
      </GridList>

      <br />

      <div className="releasedAndFilterSection">
        <div className="releasedMoviesSection">
          <GridList
            cellHeight={350}
            cols={4}
            className={classes && classes.gridList}
            style={{ minWidth: "100%" }}
          >
            {filteredReleasedMovies &&
              filteredReleasedMovies.map((releasedMovie) => (
                <GridListTile
                  key={releasedMovie.id}
                  style={{ cursor: "pointer", display: "flex" }}
                >
                  <Link to={`/movie/${releasedMovie.id}`}>
                    <img src={releasedMovie.poster_url} />
                  </Link>
                  <GridListTileBar
                    title={releasedMovie.title}
                    subtitle={`Release Date: ${releasedMovie.release_date}`}
                  />
                </GridListTile>
              ))}
          </GridList>
        </div>
        <div>
          <Card className="cardStyle" style={{ width: "100%" }}>
            <CardContent>
              <Typography variant="headline" component="h2">
                FIND MOVIES BY:
              </Typography>
              <br />

              <FormControl className="formControl">
                <InputLabel htmlFor="movieNameFilter">Movie Name</InputLabel>
                <Input
                  id="movieNameFilter"
                  value={filterText}
                  onChange={(e) => filterTextChangeHandler(e)}
                />
              </FormControl>
              <br />
              <br />

              <FormControl className="formControl">
                <InputLabel htmlFor="genres">Genres</InputLabel>
                <Select value={selectedGenres}>
                  {genres.map((genre) => (
                    <MenuItem key={"genre" + genre.id} value={genre.genre}>
                      <FormControlLabel
                        value="end"
                        control={
                          <Checkbox
                            color="primary"
                            key={`genreCheck-${genre.id}`}
                            checked={isGenreChecked(genre.id)}
                            onClick={() => toggleSelectedGenres(genre.id)}
                          />
                        }
                        label={`${genre.genre}`}
                        labelPlacement="end"
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br />
              <br />
              <FormControl className="formControl">
                <InputLabel htmlFor="artists">Artists</InputLabel>
                <Select value={selectedArtists}>
                  {artists.map((artist) => (
                    <MenuItem key={"artist" + artist.id} value={artist.id}>
                      <FormControlLabel
                        value="end"
                        control={
                          <Checkbox
                            color="primary"
                            key={`artistCheck-${artist.id}`}
                            checked={isArtistChecked(artist.id)}
                            onClick={() => toggleSelectedArtists(artist.id)}
                          />
                        }
                        label={`${artist.first_name} ${artist.last_name}`}
                        labelPlacement="end"
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br />
              <br />
              <FormControl required className="formControl">
                <TextField
                  id="standard-basic"
                  label="Release Date Start"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleStartDateChange}
                />
              </FormControl>

              <br />
              <br />

              <FormControl required className="formControl">
                <TextField
                  id="standard-basic"
                  label="Release Date End"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleEndDateChange}
                />
              </FormControl>

              <br />
              <br />
              {/* <br />
              <br />
              <FormControl required className="formControl">
                <InputLabel htmlFor="tickets">
                  Seat Selection: ( {availableTickets} available )
                </InputLabel>
                <Input
                  id="tickets"
                  value={tickets !== 0 ? tickets : ""}
                  // onChange={ticketsChangeHandler}
                />
                <FormHelperText className={"reqTickets"}>
                  <span className="red">Required</span>
                </FormHelperText>
              </FormControl> */}
              <Button
                variant="contained"
                onClick={() => filterResults()}
                color="primary"
                fullWidth
              >
                APPLY
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
