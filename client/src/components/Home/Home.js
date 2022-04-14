import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, Chip } from "@material-ui/core";
import ChipInput from "material-ui-chip-input";

import { getPosts, getPostsBySearch } from "../../actions/posts"
import Pagination from "../Pagination"
import Posts from "../Posts/Posts"
import Form from "../Form/Form"
import useStyles from "./styles"

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');

  // useEffect(() => {
  //   dispatch(getPosts());
  // }, [currentId, dispatch]);

  const searchPost = () => {
    if (searchTerm.trim() || tags) {
      // dispatch -> fetch search post
      dispatch(getPostsBySearch({ searchTerm, tags: tags.join(',') }));

      history.push(`/posts/search?searchQuery=${searchTerm || 'none'}&tags=${tags.join(',')}`);
    } else {
      history.push("/");
    }
  }

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      // search post when enter key is pressed
      searchPost();
    }
  }

  const handleAdd = (tag) => setTags([...tags, tag]);
  
  const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !== tagToDelete));

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid className={classes.mainContainer} container justifyContent="space-between" alignItems='stretch' spacing={3}>
          <Grid item xs={12} sm={8} lg={9}>
            <Posts setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={4} lg={3}>
            <AppBar className={classes.appBarSearch} position="static" color="inherit">
              <TextField
                name="search"
                label="Search Memories"
                variant="outlined"
                onKeyPress={handleKeyPress}
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ChipInput
                style={{ margin: "10px 0" }}
                value={tags}
                onAdd={handleAdd}
                onDelete={handleDelete}
                label="Search Tags"
                variant="outlined"
              />
              <Button onClick={searchPost} className={classes.searchButton} color="primary" variant="contained">Search</Button>
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
              {(!searchQuery && !tags.length) && (
                <Paper elevation={6}>
                  <Pagination page={page} />
                </Paper>
              )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  )
}

export default Home