import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@/components/Button';
import Link from '@/components/Link';
import Typography from '@mui/material/Typography';


interface ImgMediaCardProps {
    img: string,
    href: string,
    description: string,
    buttonText: string,
}


const ImgMediaCard = (props: ImgMediaCardProps) => {

  return (
    <Card sx={{ maxWidth: 280, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height={140}
        image={props.img}
      />
      <CardContent sx={{ flex: 1, textAlign: 'center' }} >
        <Typography variant="body2" color="text.secondary">
          {props.description}
        </Typography>
      </CardContent>
      <CardActions
          sx={{ display: 'flex', justifyContent: 'center' }}
      >
      <Link 
        underline="none"
        href={props.href}>
          <Button>  {props.buttonText} </Button>
      </Link>
      </CardActions>
    </Card>
  );
}





export default ImgMediaCard;
