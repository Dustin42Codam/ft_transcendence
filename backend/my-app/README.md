### What are @Decorator()?
these are decoratros
there are all kinds of decorators
### @Injectable() ?
what is this?
https://stackoverflow.com/questions/64349628/what-is-injectable-in-nestjs

```nestjs
@Injectable()
export class PersonService {
  getName() {
    return 'ninezero90hy';
  }
}

@Injectable()
export class AppService {
  constructor(private readonly personService: PersonService) {
    Logger.log(this.personService.getName())
  }
}
```

