var app=angular.module('two_way',[]);

app.directive('itemsDrag', function()
{
    return {
        link: function(scope, element, attrs)
        {
             // element == $('#items')
             element.find('asdf').draggable();
 
             scope.$on('$destroy', function()
             {
                 element.find('asdf').off('**');
             });
        }
    };
});
