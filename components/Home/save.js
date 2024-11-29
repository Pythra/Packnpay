
{error && <Text style={styles.error}>{error}</Text>}
{user ? (
  <View style={styles.userInfo}>
    <Text style={styles.text}>ID: {token}</Text>
    <Text style={styles.text}>Username: {user.username}</Text>
    <Button title="Logout" onPress={logout} />
  </View>
) : (
  <Text style={styles.text}>Loading user profile...</Text>
)}