mongo <<EOF
rs.initiate(
{
  _id: "rep",
  members: [{ _id: 0, host: "127.0.0.1:27017" }]
}
)
EOF
