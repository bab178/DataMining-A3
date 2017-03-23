docker run --name my_solr -d -p 8983:8983 -t solr
docker exec -it --user=solr my_solr bin/solr create_core -c lyrics
docker exec -it --user=solr my_solr bin/post -c lyrics ~/lyrics.csv
