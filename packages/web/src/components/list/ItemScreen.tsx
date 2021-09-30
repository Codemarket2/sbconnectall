import { useState, useEffect } from 'react';
import { useGetListItemBySlug, useDeleteListItem } from '@frontend/shared/hooks/list';
import { useCRUDListItems } from '@frontend/shared/hooks/list';
import Link from 'next/link';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '../common/Breadcrumbs';
import ErrorLoading from '../common/ErrorLoading';
import Backdrop from '../common/Backdrop';
import ImageList from '../post/ImageList';
import NotFound from '../common/NotFound';
import FieldValues from '../field/FieldValues';
import ActionButtons from '../list/ActionButtons';
import InlineForm from '../list/InlineForm';
import MediaForm from '../list/MediaForm';
import { onAlert } from '../../utils/alert';
import CommentLikeShare from '../common/commentLikeShare/CommentLikeShare';
import LeftNavigation from '../field/LeftNavigation';
import Hidden from '@material-ui/core/Hidden';
import { useSelector, useDispatch } from 'react-redux';
import { updateSettingAction } from '@frontend/shared/redux/actions/setting';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

interface IProps {
  slug: any;
  typeSlug: any;
  hideBreadcrumbs?: boolean;
  setItem?: any;
  onSlugUpdate?: (arg: string) => void;
  pushToAnchor?: () => void;
}

export default function Screen({
  slug,
  typeSlug,
  hideBreadcrumbs = false,
  setItem,
  onSlugUpdate,
  pushToAnchor,
}: IProps) {
  const router = useRouter();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));
  const setting = useSelector(({ setting }: any) => setting);

  const [state, setState] = useState({ fieldName: '', fields: [] });
  const [fieldValueCount, setFieldValueCount] = useState({});
  const deleteCallBack = () => {
    router.push(`/types/${typeSlug}`);
  };

  const updateCallBack = (newSlug) => {
    setState({ ...state, fieldName: '' });
    if (newSlug !== slug && onSlugUpdate) {
      onSlugUpdate(newSlug);
    }
  };

  const { handleDelete, deleteLoading } = useDeleteListItem({ onAlert });

  const { data, loading, error } = useGetListItemBySlug({ slug });

  const dispatch = useDispatch();

  const handleShowBottomSheet = () => {
    dispatch(updateSettingAction({ bottomDrawer: true }));
  };
  const handleHideBottomSheet = () => {
    dispatch(updateSettingAction({ bottomDrawer: false }));
  };

  const {
    state: crudState,
    setState: setCrudState,
    formik,
    setFormValues,
    CRUDLoading,
  } = useCRUDListItems({
    onAlert,
    updateCallBack,
  });

  const onCancel = () => {
    setState({ ...state, fieldName: '' });
  };

  const onEdit = (fieldName) => {
    setFormValues(data.getListItemBySlug);
    setState({ ...state, fieldName });
  };

  useEffect(() => {
    if (data && data.getListItemBySlug && setItem) {
      setItem(data.getListItemBySlug);
    }
  }, [data]);

  if (error || !data) {
    return <ErrorLoading error={error} />;
  } else if (!data.getListItemBySlug) {
    return <NotFound />;
  }

  const leftNavigationProps = {
    parentId: data.getListItemBySlug.types[0]._id,
    slug: `/types/${data.getListItemBySlug.types[0].slug}/${data.getListItemBySlug.slug}`,
    fields: state.fields,
    fieldValueCount,
  };

  return (
    <>
      {!hideBreadcrumbs && (
        <>
          <div className="d-flex justify-content-between align-content-center align-items-center">
            <Breadcrumbs>
              <Link href="/types">Types</Link>
              <Link href={`/types/${data.getListItemBySlug.types[0].slug}`}>
                <a>{data.getListItemBySlug.types[0].title}</a>
              </Link>
              <Typography color="textPrimary">
                {data.getListItemBySlug.title.includes('-n-e-w')
                  ? 'Title'
                  : data.getListItemBySlug.title}
              </Typography>
            </Breadcrumbs>
            <ActionButtons
              hideEdit
              onDelete={() => handleDelete(data.getListItemBySlug._id, deleteCallBack)}
            />
          </div>
          <Hidden smUp>
            <SwipeableDrawer
              anchor="bottom"
              open={setting.bottomDrawer}
              onClose={handleHideBottomSheet}
              onOpen={handleShowBottomSheet}>
              <LeftNavigation
                style={{ maxHeight: '40vh' }}
                onClick={handleHideBottomSheet}
                {...leftNavigationProps}
              />
            </SwipeableDrawer>
          </Hidden>
        </>
      )}
      {!hideBreadcrumbs && (
        <Hidden xsDown>
          <LeftNavigation
            style={{
              position: 'fixed',
              width: '15%',
              maxHeight: '80vh',
              paddingBottom: 10,
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
            {...leftNavigationProps}
          />
        </Hidden>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Paper
          style={{ width: matches || hideBreadcrumbs ? '100%' : '84%', border: 'none' }}
          variant="outlined"
          className="p-2 pb-5">
          {state.fieldName === 'title' ? (
            <InlineForm
              fieldName={state.fieldName}
              label="Title"
              onCancel={onCancel}
              formik={formik}
              formLoading={CRUDLoading}
            />
          ) : (
            <>
              <Typography id="title">
                Title
                <Tooltip title="Edit Title">
                  <IconButton onClick={() => onEdit('title')}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Typography variant="h4" className="d-flex align-items-center">
                {data.getListItemBySlug.title.includes('-n-e-w')
                  ? 'Title'
                  : data.getListItemBySlug.title}
              </Typography>
            </>
          )}
          <Divider className="my-2" />
          {state.fieldName === 'description' ? (
            <InlineForm
              multiline
              fieldName={state.fieldName}
              label="Description"
              onCancel={onCancel}
              formik={formik}
              formLoading={CRUDLoading}
            />
          ) : (
            <>
              <Typography id="description">
                Description
                <Tooltip title="Edit Description">
                  <IconButton onClick={() => onEdit('description')}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <div className="ck-content">{parse(data.getListItemBySlug.description)}</div>
              <CommentLikeShare parentId={data.getListItemBySlug._id} />
            </>
          )}
          <Divider className="my-2" />
          {state.fieldName === 'media' ? (
            <MediaForm
              state={crudState}
              setState={setCrudState}
              onCancel={onCancel}
              onSave={formik.handleSubmit}
              loading={CRUDLoading}
            />
          ) : (
            <>
              <Typography className="d-flex align-items-center" id="media">
                Media
                <Tooltip title="Edit Media">
                  <IconButton onClick={() => onEdit('media')}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <ImageList media={data.getListItemBySlug.media} />
            </>
          )}
          <FieldValues
            pushToAnchor={pushToAnchor}
            parentId={data.getListItemBySlug._id}
            typeId={data.getListItemBySlug.types[0]._id}
            setFields={(fields) => setState({ ...state, fields })}
            setFieldValueCount={(index, value) =>
              setFieldValueCount({ ...fieldValueCount, [index]: value })
            }
          />
        </Paper>
      </div>
      <Backdrop open={deleteLoading || CRUDLoading} />
    </>
  );
}
