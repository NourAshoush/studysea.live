package uk.ac.bham.teamproject.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Task;
import uk.ac.bham.teamproject.domain.UserExtended;

/**
 * Spring Data JPA repository for the Task entity.
 */

@SuppressWarnings("unused")
@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    @Query(value = "SELECT distinct task FROM Task task WHERE task.createdBy=:id and task.completed = false ORDER BY task.start")
    List<Task> tasksList(@Param("id") UserExtended id);
}
