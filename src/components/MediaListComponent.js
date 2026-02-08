import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { STRINGS } from '../common/strings';
import { COLORS } from '../common/colors';
import { deleteMedia, loadMediaList } from '../redux/actions/mediaActions';
import MediaItem from './MediaItem';
import CustomHeader from './CustomHeader';
import EmptyState from './EmptyState';

const MediaListComponent = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.media.list);

  useEffect(() => {
    dispatch(loadMediaList());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteMedia(id));
  };

  const renderMediaItem = ({ item }) => <MediaItem item={item} onDelete={handleDelete} />;
  const keyExtractor = (item) => item.id;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.SURFACE} />
      <CustomHeader title={STRINGS.LIST.TITLE} />

      <View style={styles.body}>
        <FlatList
          data={data}
          renderItem={renderMediaItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContentGrow}
          ListEmptyComponent={
            <EmptyState message={STRINGS.LIST.EMPTY} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SURFACE,
  },
  body: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  listContentGrow: {
    padding: 20,
    flexGrow: 1,
  },
});

export default MediaListComponent;
